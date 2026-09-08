import fs from "fs";
import fetch from "node-fetch";
import FormData from "form-data";
// ate em tal precipal
export const upload = async (filePath) => {
const form = new FormData();
form.append("file", fs.createReadStream(filePath));
const res = await fetch("https://imglink.cc/api/upload", {
method: "POST",
body: form
});
const data = await res.json();
const link = data?.images?.[0]?.url;
if (!link) {
throw new Error("erro upload");
}
return link;
};
// Enviar media pra api
export const upload2 = async (filePath) => {
const form = new FormData();
form.append("files[]", fs.createReadStream(filePath));
const res = await fetch("https://uguu.se/upload.php", {
method: "POST",
body: form
});
const data = await res.json();
if (!data.files || !data.files[0]) {
throw new Error("erro upload");
}
return data.files[0].url;
};



