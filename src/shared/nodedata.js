const { BlobServiceClient, AnonymousCredential } = require("@azure/storage-blob");


const getNodeData = async function () {

  const anonymousCredential = new AnonymousCredential();

  const blobServiceClient = new BlobServiceClient(
    // When using AnonymousCredential, following url should include a valid SAS or support public access
    ``,
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
