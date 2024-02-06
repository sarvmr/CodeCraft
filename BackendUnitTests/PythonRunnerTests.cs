

using MVC_Backend_Frontend;
using System.Text.RegularExpressions;

namespace BackendUnitTestProject;

public class PythonRunnerTests
{
    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public void PythonRunnerTest1()
    {
        string expectedResult = "donkey\n";
        string pythonCode = "print('donkey')";
        PythonRunner _pythonRunner = new PythonRunner();
        string result = Regex.Unescape(_pythonRunner.RunFromString(pythonCode));
        result = result.Replace("\r", "");
        Assert.That(result, Is.EqualTo(expectedResult));
    }
    
    [Test]
    public void PythonRunnerTest2()
    {
        string expectedResult = "donkey\ndonkey2\n";
        string pythonCode = "print('donkey')\nprint('donkey2')";
        PythonRunner _pythonRunner = new PythonRunner();
        string result = Regex.Unescape(_pythonRunner.RunFromString(pythonCode));
        result = result.Replace("\r", "");
        Assert.That(result, Is.EqualTo(expectedResult));
        
    }
    
    [Test]
    public void PythonRunnerTest3()
    {
        string expectedResult = "donkey\ndonkey2\n0\n1\n2\n3\n";
        string pythonCode = "i = 0\nprint('donkey')\nprint('donkey2')\nwhile(i < 4):\n\tprint(i)\n\ti += 1";
        PythonRunner _pythonRunner = new PythonRunner();
        string result = Regex.Unescape(_pythonRunner.RunFromString(pythonCode));
        result = result.Replace("\r", "");
        Assert.That(result, Is.EqualTo(expectedResult));
        
    }
}