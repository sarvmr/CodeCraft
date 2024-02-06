using System.Text.RegularExpressions;
using MVC_Backend_Frontend;

namespace BackendUnitTestProject;

public class JsonParserTests
{
    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public void JsonParserTest1()
    {
        string json =
            "{\"type\":\"function\",\"instruction\":\"print\",\"input\":{\"type\":\"value\",\"field\":\"text\",\"text\":\"Hello World!\"}}";
        string expectedCode = "print('Hello World!')";
        Block block = Newtonsoft.Json.JsonConvert.DeserializeObject<Block>(json);
        string result = JsonBlockParser.ParseBlock(block);
        result = result.Replace("\r", "");
        Assert.That(result, Is.EqualTo(expectedCode));
    }
    
    [Test]
    public void JsonParserTest2()
    {
        string json =
            "{\"type\":\"function\",\"field\":\"operation\",\"operation\":\"assign_variable\",\"A\":{\"type\":\"variable\",\"name\":\"index_i\"},\"B\":{\"type\":\"value\",\"field\":\"num\",\"num\":0}}";
        string expectedCode = "index_i = 0";
        Block block = Newtonsoft.Json.JsonConvert.DeserializeObject<Block>(json);
        string result = JsonBlockParser.ParseBlock(block);
        result = result.Replace("\r", "");
        Assert.That(result, Is.EqualTo(expectedCode));
    }
    
    [Test]
    public void JsonParserTest3()
    {
        string json =
            "{\"type\":\"function\",\"instruction\":\"print\",\"input\":{\"type\":\"value\",\"field\":\"operation\",\"operation\":\"add\",\"A\":{\"type\":\"value\",\"field\":\"num\",\"num\":1},\"B\":{\"type\":\"value\",\"field\":\"num\",\"num\":2}}}";
        string expectedCode = "print(1 + 2)";
        Block block = Newtonsoft.Json.JsonConvert.DeserializeObject<Block>(json);
        string returnedCode = JsonBlockParser.ParseBlock(block);
        Assert.That(returnedCode, Is.EqualTo(expectedCode));
    }
    
    [Test]
    public void JsonParserTest4()
    {
        string json =
            "{\"blocks\":[{\"type\":\"function\",\"field\":\"operation\",\"operation\":\"assign_variable\",\"A\":{\"type\":\"variable\",\"name\":\"index_i\"}," +
            "\"B\":{\"type\":\"value\",\"field\":\"num\",\"num\":0}},{\"type\":\"control\",\"instruction\":\"while\",\"input\":{\"type\":\"logic\",\"logic\":\"less\"," +
            "\"A\":{\"type\":\"variable\",\"name\":\"index_i\"},\"B\":{\"type\":\"value\",\"field\":\"num\",\"num\":5}},\"children\":[{\"type\":\"function\",\"instruction\":\"print\"," +
            "\"input\":{\"type\":\"value\",\"field\":\"text\",\"text\":\"hello world\"}},{\"type\":\"function\",\"field\":\"operation\",\"operation\":\"assign_add\",\"A\":{\"type\":\"variable\"," +
            "\"name\":\"index_i\"},\"B\":{\"type\":\"value\",\"field\":\"num\",\"num\":1}},{\"type\":\"function\",\"field\":\"operation\",\"operation\":\"assign_variable\",\"A\":{\"type\":\"variable\"," +
            "\"name\":\"index_j\"},\"B\":{\"type\":\"value\",\"field\":\"num\",\"num\":0}},{\"type\":\"control\",\"instruction\":\"while\",\"input\":{\"type\":\"logic\",\"logic\":\"less\"," +
            "\"A\":{\"type\":\"variable\",\"name\":\"index_j\"},\"B\":{\"type\":\"value\",\"field\":\"num\",\"num\":5}},\"children\":[{\"type\":\"function\",\"instruction\":\"print\"," +
            "\"input\":{\"type\":\"value\",\"field\":\"operation\",\"operation\":\"add\",\"A\":{\"type\":\"variable\",\"name\":\"index_i\"},\"B\":{\"type\":\"variable\",\"name\":\"index_j\"}}}," +
            "{\"type\":\"function\",\"field\":\"operation\",\"operation\":\"assign_add\",\"A\":{\"type\":\"variable\",\"name\":\"index_j\"},\"B\":{\"type\":\"value\",\"field\":\"num\",\"num\":1}}]}]}," +
            "{\"type\":\"function\",\"instruction\":\"print\",\"input\":{\"type\":\"value\",\"field\":\"text\",\"text\":\"hello world\"}}]}";
        string expectedCode = "index_i\\ =\\ 0\\nwhile\\ index_i\\ <\\ 5:\\n\\ \\ \\ \\ print\\('hello\\ world'\\)\\n\\ \\ \\ \\ index_i\\ \\+=\\ 1\\n\\ \\ \\ \\ index_j\\ =\\ 0\\n\\ \\ \\ \\ while\\ index_j\\ <\\ 5:\\n\\ \\ \\ \\ " +
                              "\\ \\ \\ \\ print\\(index_i\\ \\+\\ index_j\\)\\n\\ \\ \\ \\ \\ \\ \\ \\ index_j\\ \\+=\\ 1\\nprint\\('hello\\ world'\\)\\n";
        BlockList blockList = Newtonsoft.Json.JsonConvert.DeserializeObject<BlockList>(json);
        string result = Regex.Escape(JsonBlockParser.ParseBlockList(blockList));
        result = result.Replace("\r", "");
        Assert.That(result, Is.EqualTo(expectedCode));
    }
    
    [Test]
    public void JsonParserTest5()
    {
        string json =
            "{\"blocks\":[{\"type\":\"function\",\"field\":\"operation\",\"operation\":\"assign_variable\",\"A\":{\"type\":\"variable\",\"name\":\"index_i\"},\"B\":{\"type\":\"value\",\"field\":\"num\",\"num\":0}},{\"type\":\"function\",\"instruction\":\"print\",\"input\":{\"type\":\"value\",\"field\":\"text\",\"text\":\"Hello World!\"}},{\"type\":\"function\",\"instruction\":\"print\",\"input\":{\"type\":\"value\",\"field\":\"operation\",\"operation\":\"add\",\"A\":{\"type\":\"value\",\"field\":\"num\",\"num\":1},\"B\":{\"type\":\"value\",\"field\":\"num\",\"num\":2}}},{\"type\":\"control\",\"instruction\":\"while\",\"input\":{\"type\":\"logic\",\"logic\":\"less\",\"A\":{\"type\":\"variable\",\"name\":\"index_i\"},\"B\":{\"type\":\"value\",\"field\":\"num\",\"num\":5}},\"children\":[{\"type\":\"function\",\"instruction\":\"print\",\"input\":{\"type\":\"value\",\"field\":\"text\",\"text\":\"hello\"}},{\"type\":\"function\",\"field\":\"operation\",\"operation\":\"assign_add\",\"A\":{\"type\":\"variable\",\"name\":\"index_i\"},\"B\":{\"type\":\"value\",\"field\":\"num\",\"num\":1}}]}]}";
        string expectedCode = "index_i\\ =\\ 0\\nprint\\('Hello\\ World!'\\)\\nprint\\(1\\ \\+\\ 2\\)\\nwhile\\ index_i\\ <\\ 5:\\n\\ \\ \\ \\ print\\('hello'\\)\\n\\ \\ \\ \\ index_i\\ \\+=\\ 1\\n";
        BlockList blockList = Newtonsoft.Json.JsonConvert.DeserializeObject<BlockList>(json);
        string result = Regex.Escape(JsonBlockParser.ParseBlockList(blockList));
        result = result.Replace("\r", "");
        Assert.That(result, Is.EqualTo(expectedCode));
    }
}