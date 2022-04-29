import { Directus } from "@directus/sdk";

const directus = new Directus(process.env.DIRECTUS_URL);

export default directus;
