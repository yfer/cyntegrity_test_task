# cyntegrity_test_task
Test task for a job at https://Cyntegrity.com

For start:
1. Copy docker-compose.yaml file to a place where docker cli is available
2. Change in it: services->backend->volumes from //var/run/docker.sock:/var/run/docker.sock to your docker socket location
3. run docker-compose up -d
4. navigate to port 80 of the host in the browser

Remarks about my expirience:
1. This is my first time with Vue.js and Express.js. (nor really, i've tried it back when in order to use node.js you had to compile it first.)
2. I have not used js in a while, recent projects were in typescript. In my opinion types saves you a lot of time while coding.
3. This test task is too big for a test task to do it properly. I completely ignored some necessary aspects like test-ready code, or error handling.

Remarks about implementation:
1. I've put everything to separate containers, by my expirience it saves in a long run.
2. Frontend and Backend is separated too. It keeps code cleaner, add scalability and ci|cd properties. 
   When you need to share something like a validation model, you can always create a package.
3. I wanted to use envoy as reverse proxy, but didn't for now.
4. I am launching pipeline command line program in separate container, so it is required to share docker.sock with backend container.
5. Vuematerial as gui framework because i've used a lot MD frameworks recently, for the most time they are OK.

Remarks about Developer Hiring Test
1. BonusTask(DataProcessing). I can do it, but will stop with test task for now. 
    1. If you can load dataset in memory, then it is just sorting and taking element from middle. O(n log n)
    2. If you can't there are some considerations: 
        1. Do we actually need such precision? Maybe we could just chose sample size that have precision that is enough for us.
        2. If we can apply counting sort then we can aggregate batches in smaller maps, and compute median from them. 
        3. Or make histogram of batches, and then compute media. But will lose precision here too.
        4. If you want real-time, there is two heaps solution, but it will also need memory. We could try to combine it with buckets.
    3. Showing graphs
        1. We could use Chart.js for something simple(it is 50Kb or so).
        2. Or d3js if we want more interactive client gui and processing.
        3. Or render graph to image on the server and distribute it by cdn. If static display is enough. (raster, or vector)
        Chosen solutions heavily depends on details.
    4. 
    > What happens if pipeline has branches? How would you model tasks dependencies?
    
        It depend on what types of load pipeline elements doing. 
            1. If it is fast - asyncronious - messaging tasks for distributed-real-time application, 
               then we should use actor models, most actor system have all this build in.
            2. It it is like in test task, console applications that should be restricted of some capabilities, 
               then we need to find some scripting-orchestration solution for containers. 
               I heard of a tool for that, built on top of kubernetes, but don't remember the name.
            3. If all pipelines are processing data(ETL, batch, streaming, databases), and we can control 
               used language, then maybe we should utilize tools from apache foundation family. 
               They are great precisely for that.
        If you absolutely need to write one:
        We can model tasks in pipeline like tree or graph, depending on the target. 
        We will call this graph Scheme. We can call processor of such Schemes a Dispatcher. Dispatcher own Schemas. 
        Can run them, stop them etc.
        Dispatcher have notion of current State of pipelines and tasks running. 
        He regularly checks if they alive, and Log all events happenning.
        Dispatcher make actions based on policies. Policy can be attached to any element of Schema. 
        Policy is entity that contains rules for the Dispatcher. Rules can be based on Log, or part of Schema.
        Dispatcher is working in a loop. After status check of tasks, he have a list of tasks status changes. 
        He checks Policies to know what to do next. If Policy contains next step, Dispatcher do it.

        It is very abstract high-level model. Policies can be everything from "on task stop start another task"
        and "stop this pipeline" to "pass this scheme to another dispatcher", 
        "you should not run this pipeline anymore". 
        Dispatcher can be singleton, or a distributed network of ones. Tasks also can be Pipelines. 
        And Pipelines can be tasks.
        
        If you do more steps in direction of generalization then you can get Turing Machine :)
    
    5. 
        1. How you would write unit tests?
           I would write then in layers or unit. 
           Every layer of model that you want to cover should be loose coupled from the rest of program, and covered with tests after that. 
           You should use mocks for it.
        2. How you would write integration tests?
           It is different from unit tests by direction of isolation. Unit tests isolates inside-out. Integration - outside-in. 
           You take whole system, and cut(mock,isolate) components that are not under test. Cover all that remains.
        3. CI|CD In the simplest form we should setup unit and part of integration tests to run before(or after, if it is not critical) publish in develop.
           Smoke tests are performed, so we know if anything important and high-level is broken. If everything is ok we should perform
           system and acceptance tests to know if system comply with specs( theese are last becouse they more compute intensive).
           General rule - fastest to check - first. Most important(they are usually slower) in the middle. Regressions, performances etc last as they are slow.
        4. If you were to use a message-broker for backend, what would you choose, how it may work?
           Main considerations are: throughput, delivery garanties, one-to-one|one-to-many, distributive, foult-tolerant.
           We can change architecture a bit, so broker turn to be useful. 
           We could publish our pipeline run processes parameters as a job to a topic. Pipeline processes, as services, will pull from there, compute, and publish result.
           Such schemas are scalable. 
        5. To pack every component that should be isolated in it's own container. So we will have no dependency hell. 
           Can test every component on it own. Can distribute and publish results easily.
           
           

