namespace MVC_Backend_Frontend.Models;

public class TutorialModel
{
    public string? RequestId { get; set; }

    public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);
}
