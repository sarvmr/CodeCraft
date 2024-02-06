using Microsoft.AspNetCore.Mvc;
using System.Text;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using MVC_Backend_Frontend.Models;
using Microsoft.AspNetCore.Http.HttpResults;

namespace MVC_Backend_Frontend.Controllers;

[Route("file")]
public class FileController : Controller
{
    private IMongoDatabase db;
    private IGridFSBucket gridFS;
    private IMongoClient _mongoClient;


    public FileController(IMongoClient mongoClient)
    {
        _mongoClient = mongoClient;
        db = _mongoClient.GetDatabase("CodeCraft");
        gridFS = new GridFSBucket(db);
    }

    [HttpPost]
    [Route("uploadtext")]
    public ActionResult UploadText([FromBody] UploadTextModel model)
    {
        try
        {
            

            if (model.Content == null)
            {
                return BadRequest("Content cannot be null");
            }

            // Upload the file
            byte[] contentBytes = System.Text.Encoding.UTF8.GetBytes(model.Content);
            var stream = new MemoryStream(contentBytes);
            ObjectId fileId = gridFS.UploadFromStream(model.Name, stream);

            // Get the MongoUser document for the current user
            var usersCollection = db.GetCollection<MongoUser>("users"); // replace "users" with the actual collection name
            var userFilter = Builders<MongoUser>.Filter.Eq(u => u.Email, User.Identity.Name); // replace "Username" with the actual property name
            var user = usersCollection.Find(userFilter).FirstOrDefault();

            if (user != null)
            {
                // Add the file name to the user's projects and save the updated user document
                user.Projects.Add(model.Name);
                var userUpdate = Builders<MongoUser>.Update.Set(u => u.Projects, user.Projects);
                usersCollection.UpdateOne(userFilter, userUpdate);
            }

            return RedirectToAction("Index", "Home");
        }
        catch (Exception e)
        {
            
            return StatusCode(500);
        }
    }



    [HttpGet]
    public ActionResult DisplayFileContents(string fileName)
    {
        using (var stream = gridFS.OpenDownloadStreamByName(fileName))
        {
            var reader = new StreamReader(stream);
            var fileContent = reader.ReadToEnd();
            ViewBag.FileName = fileName;
            return View((object)fileContent);
        }
    }

    [HttpPost]
    [Route("savefile")]
    public ActionResult SaveFile([FromBody] UploadTextModel model)
    {
        try
        {
            
            
            DeleteFile(model.Name);

            using (var stream = new MemoryStream(Encoding.UTF8.GetBytes(model.Content)))
            {
                gridFS.UploadFromStream(model.Name, stream);
            }

            var usersCollection = db.GetCollection<MongoUser>("users");
            var userFilter = Builders<MongoUser>.Filter.Eq(u => u.Email, User.Identity.Name);
            var user = usersCollection.Find(userFilter).FirstOrDefault();

            if (user != null)
            {
                user.Projects.Add(model.Name);
                var userUpdate = Builders<MongoUser>.Update.Set(u => u.Projects, user.Projects);
                usersCollection.UpdateOne(userFilter, userUpdate);
            }

            return Json(new { success = true, message = "Work successfully saved." });
        }
        catch (Exception ex)
        {
            return Json(new { success = false, message = $"Error saving work: {ex.Message}" });
        }
    }



    [HttpDelete]
    public ActionResult DeleteFile(string fileName)
    {   
        
        var filter = Builders<GridFSFileInfo>.Filter.Eq(x => x.Filename, fileName);
        var fileInfo = gridFS.Find(filter).FirstOrDefault();

        if (fileInfo != null)
        {
            gridFS.Delete(fileInfo.Id);
            
        }

        return RedirectToAction("Index");
    }

    [HttpGet]
    [Route("showAllFiles")]
    public List<string> ListAllFiles()
    {
        var filter = Builders<GridFSFileInfo>.Filter.Empty;
        var filesInfo = gridFS.Find(filter).ToList();

        List<string> fileNames = new List<string>();
        foreach (var fileInfo in filesInfo)
        {
            fileNames.Add(fileInfo.Filename);
        }

        return fileNames;
    }

    // This is for showing all the projects of the logged in user
    [HttpGet]
    [Route("showAllMyFiles")]
    public ActionResult<List<string>> ListAllUserFiles()
    {
        try
        {
            var usersCollection = db.GetCollection<MongoUser>("users");
            var userFilter = Builders<MongoUser>.Filter.Eq(u => u.Email, User.Identity.Name);
            var user = usersCollection.Find(userFilter).FirstOrDefault();
            if (user != null)
            {
                return Ok(new { Projects = user.Projects });
            }
            return Ok(new { Projects = new List<string>() });
        }
        catch (Exception ex)
        {
            return BadRequest(new { ErrorMessage = ex.Message });
        }
    }

    [HttpGet]
    [Route("loadAProject")]
    public ActionResult<string> LoadAProject(string projectName, string userName = null)
    {
        try
        {
            // Use the provided userName parameter if available; otherwise, use the currently authenticated user's name
            string userEmail = !string.IsNullOrEmpty(userName) ? userName : User.Identity.Name;

            var usersCollection = db.GetCollection<MongoUser>("users");
            var userFilter = Builders<MongoUser>.Filter.Eq(u => u.Email, userEmail);
            var user = usersCollection.Find(userFilter).FirstOrDefault();

            if (user != null)
            {
                // Check if projectName is provided
                if (!string.IsNullOrEmpty(projectName))
                {
                    // If projectName is provided, filter projects based on the name
                    var project = user.Projects.FirstOrDefault(p => p.Equals(projectName, StringComparison.OrdinalIgnoreCase));

                    if (project != null)
                    {
                        // Retrieve the file contents based on the project name
                        using (var stream = gridFS.OpenDownloadStreamByName(project))
                        using (var reader = new StreamReader(stream))
                        {
                            string fileContents = reader.ReadToEnd();
                            return Ok(new { ProjectContents = fileContents });
                        }
                    }
                    else
                    {
                        return NotFound(new { ErrorMessage = $"Project '{projectName}' not found for the user." });
                    }
                }
                else
                {
                    // If no projectName provided, return BadRequest
                    return BadRequest(new { ErrorMessage = "ProjectName parameter is required for this request." });
                }
            }

            return Ok(new { Projects = new List<string>() });
        }
        catch (Exception ex)
        {
            return BadRequest(new { ErrorMessage = ex.Message });
        }
    }


}