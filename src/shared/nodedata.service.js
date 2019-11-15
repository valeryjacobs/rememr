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

  let nodeMetaData = JSON.parse(blobProperties.metadata.nodemeta);

  return {
    id: nodeId,
    content: nodeContent,
    metadata: nodeMetaData,
  };
};

const addNode = async function (newNode) {
  const blockBlobClient = containerClient.getBlockBlobClient(newNode.id);
  await blockBlobClient.upload(newNode.content, newNode.content.length);
  await blockBlobClient.setMetadata({ "nodemeta": JSON.stringify(newNode.metadata) });
};

const updateNode = async function (node) {
  let x = node;
  console.log(x);
  const blockBlobClient = containerClient.getBlockBlobClient(node.id);
  await blockBlobClient.upload(node.content, node.content.length);
  await blockBlobClient.setMetadata({ "nodemeta": JSON.stringify(node.metadata) });
};

const deleteNode = async function (nodeId) {
  console.log(nodeId);
};

const getMetadata = async function (nodeId) {
  const blobClient = containerClient.getBlobClient(nodeId);
  const blobProperties = await blobClient.getProperties();
  let nmds = JSON.parse(blobProperties.metadata.nodemeta);
  return nmds;
}

const setMetadata = async function (nodeId, metadata) {
  const blobClient = containerClient.getBlobClient(nodeId);
  console.log(blobClient + metadata);

  await blobClient.setMetadata({ "nodemeta": JSON.stringify(metadata) });
  //{"title":"RootNode","ins":[],"outs":[]}
}

export const nodeDataService = {
  getNode,
  addNode,
  updateNode,
  deleteNode,
  getMetadata,
  setMetadata
};

