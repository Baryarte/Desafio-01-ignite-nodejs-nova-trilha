import assert from 'node:assert';
import { generate } from 'csv-generate';
import { parse } from 'csv-parse';
import fs from 'node:fs';

const csvPath = new URL("../tasks.csv", import.meta.url).pathname;

(async () => {
    const records = []

    try {
        const parser = fs.createReadStream(csvPath).pipe(parse({
            from_line: 2
        }));
        
        for await (const record of parser){
            records.push(record)
            console.log(record[0], record[1]);
            await fetch("http://localhost:3333/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    
                        title: record[0],
                        description: record[1]
                    
                }) ,
                // duplex: 'half'
            })
        }
    } catch (err) {
        console.error("Error:", err)
    }
})()



