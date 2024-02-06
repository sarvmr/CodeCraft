using Microsoft.AspNetCore.Mvc;
using System.Text;
using MVC_Backend_Frontend.Models;
using MVC_Backend_Frontend;
using Newtonsoft.Json;


namespace Backend.Controllers
{
    [ApiController]
    public class PythonController : ControllerBase
    {
        [Route("api/runPython")]
        [HttpPost]
        public async Task<IActionResult> PostPythonFromJson([FromBody] BlockList blockInput)
        {
            
            try
            {
                PythonRunner pyRunner = new PythonRunner();
                string output = pyRunner.RunFromBlockList(blockInput);

                // Sending the output to the API as an error message for demonstration purposes

                return Ok(output);
            }
            catch (Exception e)
            {
                string error = e.Message;
                string apiResponse = await SendErrorMessageToExternalAPI(error);
                
                MyError response = JsonConvert.DeserializeObject<MyError>(apiResponse);
                return BadRequest(response.Message);
            }
        }


        private async Task<string> SendErrorMessageToExternalAPI(string errorMessage)
        {
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    var apiUrl = "https://codecraftapierr.azurewebsites.net/api/api/send-err";
                    var content = new StringContent("{\"message\": \"" + errorMessage + "\"}", Encoding.UTF8, "application/json");

                    var response = await client.PostAsync(apiUrl, content);

                    if (response.IsSuccessStatusCode)
                    {
                        var responseContent = await response.Content.ReadAsStringAsync();
                        return responseContent;
                    }
                    else
                    {
                        string errorResponse = $"API call failed with status code: {response.StatusCode}";
                        // Log or handle errorResponse
                        return errorResponse;
                    }
                }
                catch (HttpRequestException ex)
                {
                    string requestError = $"HTTP Request Error: {ex.Message}";
                    // Log or handle requestError
                    return requestError;
                }
                catch (Exception ex)
                {
                    string otherError = $"An error occurred: {ex.Message}";
                    // Log or handle otherError
                    return otherError;
                }
            }
        }

        [Route("api/parsePythonCode")]
        [HttpPost]
        public IActionResult PostPythonCode([FromBody] BlockList blockInput)
        {
            try
            {
                string code = "";
            if (blockInput != null && blockInput.blocks != null)
            {
                foreach (var block in blockInput.blocks)
                {
                    code += JsonBlockParser.ParseBlock(block) + "\n";
                }
            }
                return Ok(code);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
}
