require("dotenv").config();
const port = process.env.PORT || 3040;
const https = require("https");
const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs-extra");
const app = express();
const axios = require("axios");

app.use(cors());

let request;

const servers = [
  {
    name: "ICJIA image server",
    proto: "https",
    options: {
      hostname: `image.icjia.cloud`,
      path: "/healthcheck",
      method: "HEAD"
    },
    category: "image",
    displayURL: true
  },
  {
    name: "ICJIA mail server",
    proto: "https",
    options: {
      hostname: `mail.icjia.cloud`,
      path: "/",
      method: "HEAD"
    },
    category: "image",
    displayURL: true,
    github: 'https://github.com/ICJIA/icjia-nodemailer'
  },

  {
    name: "Adult Redeploy Illinois API server",
    proto: "https",
    options: {
      hostname: `ari.icjia-api.cloud`,
      path: "/_health",
      method: "HEAD"
    },
    category: "api",
    displayURL: true
  },
  {
    name: "Adult Redeploy Illinois site",
    proto: "https",
    options: {
      hostname: `icjia.illinois.gov`,
      path: "/adultredeploy",
      method: "HEAD"
    },
    category: "site",
    displayURL: true,
    bageID: "c5bb4929-d406-4cf0-a82c-e803c3eaeb34",
    github: 'https://github.com/ICJIA/adult-redeploy-client-next'
  },
  {
    name: "ICJIA COVID site",
    proto: "https",
    options: {
      hostname: `icjia.illinois.gov`,
      path: "/covid19",
      method: "HEAD"
    },
    category: "site",
    displayURL: true,
    badgeID: "a08caed8-177f-4ac8-9d1c-9fdb1edd6c0f",
    github: 'https://github.com/ICJIA/icjia-covid19-news'
  },
  

  {
    name: "Sentencing Policy Advisory Council API server",
    proto: "https",
    options: {
      hostname: `spac.icjia-api.cloud`,
      path: "/_health",
      method: "HEAD"
    },
    category: "api",
    displayURL: true
  },
  {
    name: "Sentencing Policy Advisory Council site",
    proto: "https",
    options: {
      hostname: `spac.illinois.gov`,
      path: "/",
      method: "HEAD"
    },
    category: "site",
    badgeID: "71c65928-9986-4104-bd78-465726edb356",
    displayURL: true,
    github: 'https://github.com/ICJIA/spac-client-next'
  },
  {
    name: "ICJIA Intranet API server",
    proto: "https",
    options: {
      hostname: `dev.icjia-api.cloud`,
      path: "/_health",
      method: "HEAD"
    },
    category: "api",
    displayURL: true
  },
  {
    name: "ICJIA Intranet site",
    proto: "https",
    options: {
      hostname: `intranet.icjia.cloud`,
      path: "/",
      method: "HEAD"
    },
    category: "site",
    badgeID: "d2541ea1-ab56-48b5-840c-d2f26d57b887",
    displayURL: true,
    github: 'https://github.com/ICJIA/icjia-intranet-client'
  },
  {
    name: "ICJIA Research Hub API server",
    proto: "https",
    options: {
      hostname: `researchhub.icjia-api.cloud`,
      path: "/_health",
      method: "HEAD"
    },
    category: "api",
    displayURL: true
  },
   {
    name: "ICJIA IFVCC API server",
    proto: "https",
    options: {
      hostname: `ifvcc.icjia-api.cloud`,
      path: "/_health",
      method: "HEAD"
    },
    category: "api",
    displayURL: true
  },
  {
    name: "ICJIA Document Archive API server",
    proto: "https",
    options: {
      hostname: `archive.icjia-api.cloud`,
      path: "/",
      method: "HEAD"
    },
    displayURL: true,
    category: "api",
    github: 'https://github.com/ICJIA/icjia-document-archive-server'
  },

  {
    name: "ICJIA document archive site",
    proto: "https",
    options: {
      hostname: `archive.icjia.cloud`,
      path: "/",
      method: "HEAD"
    },
    category: "site",
    badgeID: "f93389c6-7593-495f-9309-6a3a9729eb81",
    displayURL: true,
    github: 'https://github.com/ICJIA/icjia-document-archive-client'
  },
  {
    name: "ICJIA GATA site",
    proto: "https",
    options: {
      hostname: `icjia.illinois.gov`,
      path: "/gata",
      method: "HEAD"
    },
    category: "site",
    badgeID: "2de6c7f6-eb69-4419-baf5-7e54a8943b00",
    displayURL: true,
    github: 'https://github.com/ICJIA/icjia-gata-next-2020'
  },

  {
    name: "ICJIA DICRA site",
    proto: "https",
    options: {
      hostname: `icjia.illinois.gov`,
      path: "/dicra",
      method: "HEAD"
    },
    category: "site",
    badgeID: "7b0cebc2-2016-4528-96e6-3a4687330287",
    displayURL: true,
    github: 'https://github.com/ICJIA/icjia-dicra'
  },

  {
    name: "ICJIA R3 site",
    proto: "https",
    options: {
      hostname: `icjia.illinois.gov`,
      path: "/r3",
      method: "HEAD"
    },
    category: "site",
    badgeID: "90d739fc-a5ed-459d-8616-d05a6a9e235d",
    displayURL: true,
    github: 'https://github.com/ICJIA/icjia-r3'
  },

  {
    name: "ICJIA GATA site (legacy)",
    proto: "https",
    options: {
      hostname: `legacy-grants.icjia.cloud`,
      path: "/",
      method: "HEAD"
    },
    category: "site",
    badgeID: "36772a61-8687-4f4b-b7ed-75d6d3aeebf5",
    displayURL: true,
    github: 'https://github.com/ICJIA/icjia-gata-legacy'
  },
  {
    name: "ICJIA Research Hub site",
    proto: "https",
    options: {
      hostname: `icjia.illinois.gov`,
      path: "/researchhub",
      method: "HEAD"
    },
    category: "site",
    badgeID: "ec5d97dc-175c-47c6-9d4c-81cff1389b04",
    displayURL: true,
    github: 'https://github.com/ICJIA/researchhub'
  },

  {
    name: "ICJIA Research Hub Shinyproxy server",
    proto: "https",
    options: {
      hostname: `app.icjia.cloud`,
      path: "/",
      method: "HEAD"
    },
    category: "site",
    displayURL: true,
    github: 'https://github.com/ICJIA/shinyproxy-containerized'
  },

  {
    name: "ICJIA Research Hub Documentation",
    proto: "https",
    options: {
      hostname: `icjia.illinois.gov`,
      path: "/researchhub/docs",
      method: "HEAD"
    },
    category: "site",
    badgeID: "ddd1e0fc-f083-4e0b-b498-a94f092cc5c3",
    displayURL: true,
    github: 'https://github.com/ICJIA/researchhub-docs'
  },

  {
    name: "ICJIA Research Hub Preview site",
    proto: "https",
    options: {
      hostname: `icjia.illinois.gov`,
      path: "/researchhub/preview",
      method: "HEAD"
    },
    category: "site",
    badgeID: "dbd6b99c-0425-4747-b56a-f9cf110d0d21",
    displayURL: true,
    github: 'https://github.com/ICJIA/researchhub-preview'
  },

  {
    name: "ICJIA Research Hub Studio site",
    proto: "https",
    options: {
      hostname: `icjia.illinois.gov`,
      path: "/researchhub/studio",
      method: "HEAD"
    },
    category: "site",
    badgeID: "06ee6f20-0531-45dc-a337-d4357f903aeb",
    displayURL: true,
    github: 'https://github.com/ICJIA/researchhub-studio'
  },

  {
    name: "ICJIA public site",
    proto: "http",
    options: {
      hostname: `www.icjia.state.il.us`,
      path: "/healthcheck",
      method: "HEAD"
    },
    category: "site",
    displayURL: true,
    github: 'https://github.com/ICJIA/icjia-public-website'
  },
  
  {
    name: "Illinois HEALS site",
    proto: "https",
    options: {
      hostname: `ilheals.com`,
      path: "/",
      method: "HEAD"
    },
    category: "site",
    badgeID: "f3ad230c-0ccc-421e-b822-484276a3069b",
    displayURL: true,
    github: 'https://github.com/ICJIA/icjia-illinois-heals'
  },
  {
    name: "ICJIA coronavirus information API server",
    proto: "https",
    options: {
      hostname: `coronavirus.icjia-api.cloud`,
      path: "/healthcheck",
      method: "HEAD"
    },
    category: "site",
    displayURL: true,
    github: 'https://github.com/ICJIA/icjia-coronavirus-information-server'
  },
  {
    name: "ICJIA site status API server",
    proto: "https",
    options: {
      hostname: `status.icjia-api.cloud`,
      path: "/healthcheck",
      method: "HEAD"
    },
    category: "site",
    displayURL: true,
    github: 'https://github.com/ICJIA/icjia-status-server'
  },
  {
    name: "ICJIA status site",
    proto: "https",
    options: {
      hostname: `icjia-status.netlify.com`,
      path: "/",
      method: "HEAD"
    },
    category: "site",
    displayURL: true,
    github: 'https://github.com/ICJIA/icjia-status',
    badgeID: 'ec8416ef-1c8e-495c-a2d6-500f1a03af36'
  },
  {
    name: "ICJIA Markdown Editor",
    proto: "https",
    options: {
      hostname: `markdown.icjia.cloud`,
      path: "/",
      method: "HEAD"
    },
    category: "site",
    displayURL: true,
    github: 'https://github.com/ICJIA/icjia-markdown-next',
    badgeID: 'efc7c372-8945-4089-acbd-5201f59a753e'
  },
  {
    name: "ICJIA FSGU Calendar site",
    proto: "https",
    options: {
      hostname: `calendar.icjia.cloud`,
      path: "/",
      method: "HEAD"
    },
    category: "site",
    displayURL: true,
    github: 'https://github.com/ICJIA/icjia-calendar',
    badgeID: '711d72d1-a0a7-45ac-9b01-a3d01f9a1a40'
  },
  {
    name: "ICJIA FSGU Calendar API Server",
    proto: "https",
    options: {
      hostname: `content.icjia-api.cloud`,
      path: "/",
      method: "HEAD"
    },
    category: "api",
    displayURL: true,
   
  },
  {
    name: "ICJIA Criminal Justice Reform Commission site",
    proto: "http",
    options: {
      hostname: `www.icjia.state.il.us`,
      path: "/cjreform2015",
      method: "HEAD"
    },
    category: "site",
    displayURL: true,
    github: 'https://github.com/ICJIA/icjia-criminal-justice-reform-commission'
  },
  {
    name: "ICJIA Family Violence Coordinating Councils",
    proto: "http",
    options: {
      hostname: `www.icjia.state.il.us`,
      path: "/ifvcc",
      method: "HEAD"
    },
    category: "site",
    displayURL: true,
    github: 'https://github.com/ICJIA/icjia-public'
  },
  {
    name: "ICJIA Institutional Review Board site",
    proto: "https",
    options: {
      hostname: `icjia.illinois.gov`,
      path: "/irb/",
      method: "HEAD"
    },
    category: "site",
    badgeID: "f3e4ce5f-9c40-4bb4-81e0-8411f99d9dd5",
    displayURL: true,
    github: 'https://github.com/ICJIA/icjia-irb-next'
  },
  {
    name: "ICJIA Arrest Explorer",
    proto: "https",
    options: {
      hostname: `icjia.illinois.gov`,
      path: "/arrestexplorer/",
      method: "HEAD"
    },
    category: "site",
    badgeID: '20a96cf3-a8d5-4ece-8105-ae485c4ce3da',
    displayURL: true,
    github: 'https://github.com/ICJIA/arrest_explorer'
  },
  {
    name: "ICJIA Arrest Explorer Documentation",
    proto: "https",
    options: {
      hostname: `icjia.illinois.gov`,
      path: "/arrestexplorer/docs/",
      method: "HEAD"
    },
    category: "site",
    
    displayURL: true,
    github: 'https://github.com/ICJIA/arrest_explorer'
  },
 
];

function queryHttps(server) {
  // eslint-disable-next-line no-unused-vars
  return new Promise(function (resolve, reject) {
    let start = new Date();
    request = https.get(server.options, response => {
      let end = new Date();
      let duration = end - start;
      server.status = response.statusCode;
      server.statusMessage = response.statusMessage;
      server.duration = duration + "ms";
      server.headers = response.headers;

      resolve(server);
    });
    request.on("error", error => {
      server.status = error;
      resolve(server);
    });
  });
}

async function queryHttp(server) {
  // eslint-disable-next-line no-unused-vars
  let start = new Date();
  return axios
    .head(`${server.proto}://${server.options.hostname}`)
    .then(res => {
      let end = new Date();

      let duration = end - start;
      server.status = res.status;
      server.duration = duration + "ms";
      server.headers = res.headers;
      return server;
    });
}

app.get("/", async (req, res) => {
  let serverArr = servers.map(server => {
    if (server.proto === "https") {
      return queryHttps(server);
    } else {
      return queryHttp(server);
    }
  });
  let response = await Promise.all(serverArr);
  res.send(response);
});

app.get("/healthcheck", (req, res) =>
  res.send({ status: 200, msg: "Working!" })
);

app.listen(port, () => console.log(`Server listening on port ${port}`));
