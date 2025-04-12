import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const pluginFiles = readdirSync("./plugins").filter(file => file.endsWith('.mjs'));

for (const file of pluginFiles) {
    
}
