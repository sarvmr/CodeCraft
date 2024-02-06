using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


namespace MVC_Backend_Frontend.Models;

public class MongoUser
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("Email")]
    public string Email { get; set; } = null!;

    public string Role { get; set; } = null!;

    public List<string> Projects { get; set; } = null!;

    public string Level { get; set; } = null!;

}