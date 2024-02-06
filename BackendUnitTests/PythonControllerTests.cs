using System.Text.RegularExpressions;
using Backend.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace BackendUnitTestProject;

public class PythonControllerTests
{
    [Test]
    public async Task PythonControlllerTest1Async()
    {
        string json =
            "{\"blocks\":[{\"type\":\"function\",\"field\":\"operation\",\"operation\":\"assign_variable\",\"A\":{\"type\":\"variable\",\"name\":\"index_i\"},\"B\":{\"type\":\"value\",\"field\":\"num\",\"num\":0}},{\"type\":\"function\",\"instruction\":\"print\",\"input\":{\"type\":\"value\",\"field\":\"text\",\"text\":\"Hello World!\"}},{\"type\":\"function\",\"instruction\":\"print\",\"input\":{\"type\":\"value\",\"field\":\"operation\",\"operation\":\"add\",\"A\":{\"type\":\"value\",\"field\":\"num\",\"num\":1},\"B\":{\"type\":\"value\",\"field\":\"num\",\"num\":2}}},{\"type\":\"control\",\"instruction\":\"while\",\"input\":{\"type\":\"logic\",\"logic\":\"less\",\"A\":{\"type\":\"variable\",\"name\":\"index_i\"},\"B\":{\"type\":\"value\",\"field\":\"num\",\"num\":5}},\"children\":[{\"type\":\"function\",\"instruction\":\"print\",\"input\":{\"type\":\"value\",\"field\":\"text\",\"text\":\"hello\"}},{\"type\":\"function\",\"field\":\"operation\",\"operation\":\"assign_add\",\"A\":{\"type\":\"variable\",\"name\":\"index_i\"},\"B\":{\"type\":\"value\",\"field\":\"num\",\"num\":1}}]}]}";
        BlockList blockList = Newtonsoft.Json.JsonConvert.DeserializeObject<BlockList>(json)!;
        string expectedResult = "Hello World!\n3\nhello\nhello\nhello\nhello\nhello\n";
        PythonController pythonController = new PythonController();
        IActionResult actionResult = await pythonController.PostPythonFromJson(blockList);
        var okResult = actionResult as OkObjectResult;
        string result = Regex.Unescape(okResult.Value as string);
        result = result.Replace("\r", "");
        Assert.That(result, Is.EqualTo(expectedResult));
        
    }
}