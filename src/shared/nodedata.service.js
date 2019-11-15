const { BlobServiceClient, AnonymousCredential } = require("@azure/storage-blob");

const anonymousCredential = new AnonymousCredential();

const blobServiceClient = new BlobServiceClient(
  // When using AnonymousCredential, following url should include a valid SAS or support public access
  localStorage.getItem('storageaccountsas'),
  anonymousCredential
);

const containerClient = blobServiceClient.getContainerClient('nodes');

const getNode = async function (nodeId) {

  const blobClient = containerClient.getBlobClient(nodeId);
  const blobProperties = await blobClient.getProperties();

  const downloadBlockBlobResponse = await blobClient.download();

  const nodeContent = await blobToString(await downloadBlockBlobResponse.blobBody);

  async function blobToString(blob) {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
      fileReader.onloadend = (ev) => {
        resolve(ev.target.result);
      };
      fileReader.onerror = reject;
      fileReader.readAsText(blob);
    });
  }

  return {
    content: nodeContent,
    in: JSON.parse( blobProperties.metadata.in),
    out: JSON.parse(blobProperties.metadata.out)
  };
};

const addNode = async function (node) {
  const blockBlobClient = containerClient.getBlockBlobClient(node.id);
   await blockBlobClient.upload(node.content, node.content.length);

  await blockBlobClient.setMetadata({in:node.in,out:node.out});

};

const updateNode = async function (node) {
  console.log(node);
};

const deleteNode = async function (nodeId) {
  console.log(nodeId);
};

export const nodeDataService = {
  getNode,
  addNode,
  updateNode,
  deleteNode
};

