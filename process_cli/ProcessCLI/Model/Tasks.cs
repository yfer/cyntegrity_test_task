using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProcessCLI.Model
{
    [BsonIgnoreExtraElements]
    public class Tasks
    {
        [BsonId]
        public ObjectId Id { get; set; }

        [BsonElement("name")]
        public string name { get; set; }

        [BsonElement("avarageTimeInSeconds")] 
        public int avarageTimeInSeconds { get; set; }
    }
}
