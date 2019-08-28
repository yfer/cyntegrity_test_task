using MongoDB.Bson;
using MongoDB.Driver;
using ProcessCLI.Model;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;

namespace ProcessCLI
{
    class Program
    {
        static void Main(string[] args)
        {
            if (args.Length != 3)
            {
                Console.WriteLine("Please provide args: MONGOCONNECTION MONGODB PIPELINEID");
                return;
            }
            try
            {
                //todo: check args;
                var settings = new CredentialsForMongo()
                {
                    ConnectionString = args[0],
                    Database = args[1]
                };
                var id = args[2];

                var job = Task.Run(() => GetResult(settings, id));
                job.Wait();
                var result = job.Result;
                Console.WriteLine(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }

        static private async Task<int> GetResult(CredentialsForMongo settings, string id)
        {
            var sw = new Stopwatch();
            sw.Start();
            var client = new MongoClient(settings.ConnectionString);
            var db = client.GetDatabase(settings.Database);
            var pipelines = db.GetCollection<Pipelines>("pipelines");
            var tasks = db.GetCollection<Tasks>("tasks");

            //todo: use aggregation, lookup etc.
            var query = await pipelines.FindAsync(new BsonDocument("_id", new ObjectId(id)));
            var pipeline = await query.SingleOrDefaultAsync();
            foreach(var task in pipeline.Tasks)
            {
                var querytask = await tasks.FindAsync(new BsonDocument("_id", task));
                var taskres = await querytask.SingleOrDefaultAsync();
                await Task.Delay(new TimeSpan(0, 0, taskres.avarageTimeInSeconds));

            }
            sw.Stop();
            return System.Convert.ToInt32(Math.Floor(sw.Elapsed.TotalSeconds));
        }
    }
}
