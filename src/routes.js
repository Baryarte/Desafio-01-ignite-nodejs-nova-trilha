import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search, title, description } = req.query;

      const tasks = database.select(
        "tasks",
        title
          ? {
              title: title,
            }
          : description
          ? {
              description: decodeURI(description),
            }
          : undefined
      );

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;
     console.log("requisição recebida");
      const user = {
        id: randomUUID(),
        title,
        description,
        completed_at: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert("tasks", user);

      return res.writeHead(201).end("");
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;
        
        let updateData = {
            ...(title != null && {title}),
            ...(description != null && {description}),
            updated_at: new Date(),
        }
        
        try{
            database.update("tasks", id, updateData );
        } catch (err){
            return res.writeHead(404).end(err.toString())
        }
      

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      try{
          database.delete("tasks", id);
      } catch (err){
        return res.writeHead(404).end(err.toString())
      }

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      try{
            const currentData = database.selectByID("tasks", id);
            console.log(currentData);
            if (currentData.completed_at) {
                database.update("tasks", id, {completed_at: false, updated_at: new Date()});
            } else {
                database.update("tasks", id, {completed_at: true, updated_at: new Date()});
            }
        } catch (err){
            return res.writeHead(404).end(err.toString())
        }
      

      return res.writeHead(204).end();
    },
  }
];
