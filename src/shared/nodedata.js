const { BlobServiceClient, AnonymousCredential } = require("@azure/storage-blob");


const getNodeData = async function () {

  const anonymousCredential = new AnonymousCredential();

  const blobServiceClient = new BlobServiceClient(
    // When using AnonymousCredential, following url should include a valid SAS or support public access
    `https://jobblr.blob.core.windows.net/?sv=2019-02-02&ss=b&srt=sco&sp=rwdlac&se=2024-11-14T05:38:12Z&st=2019-11-13T21:38:12Z&spr=https&sig=Myqspe4jWnNT87Fndk6ntoViRIguYDby8cY7yTRlGZc%3D`,
    anonymousCredential
  );

  const containerClient = blobServiceClient.getContainerClient('nodes');
  
 
 
  let i = 1;
  let iter = await containerClient.listBlobsFlat();
  for await (const blob of iter) {
    console.log(`Blob ${i++}: ${blob.name}`);
  }

  const blobClient = containerClient.getBlobClient('root');
  const meraData = await blobClient.getProperties();

  return { data: meraData };
};

export const nodeData = {
  getNodeData,
};