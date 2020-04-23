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
      method: "GET"
    },
    category: "image",
    displayURL: true
  },

  {
    name: "Adult Redeploy Illinois api server",
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
    name: "Adult Redeploy Illinois deployment",
    proto: "https",
    options: {
      hostname: `adultredeploy-dev.netlify.com`,
      path: "/",
      method: "HEAD"
    },
    category: "site",
    displayURL: false,
    bageID: "c5bb4929-d406-4cf0-a82c-e803c3eaeb34",
    github: 'https://github.com/ICJIA/adult-redeploy-client-next'
  },
  {
    name: "Adult Redeploy Illinois site redirect",
    proto: "https",
    options: {
      hostname: `icjia.illinois.gov`,
      path: "/adultredeploy",
      method: "HEAD"
    },
    category: "site",
    displayURL: true
  },

  {
    name: "Sentencing Policy Advisory Council api server",
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
    name: "ICJIA Research Hub api server",
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
    name: "ICJIA document archive api server",
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
    name: "ICJIA document archive website",
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
    name: "ICJIA GATA deployment",
    proto: "https",
    options: {
      hostname: `gatadev.netlify.com`,
      path: "/",
      method: "HEAD"
    },
    category: "site",
    badgeID: "2de6c7f6-eb69-4419-baf5-7e54a8943b00",
    displayURL: false,
    github: 'https://github.com/ICJIA/icjia-gata-next-2020'
  },
  {
    name: "ICJIA GATA site redirect",
    proto: "https",
    options: {
      hostname: `icjia.illinois.gov`,
      path: "/gata",
      method: "HEAD"
    },
    category: "redirect",
    displayURL: true
  },
  {
    name: "ICJIA R3 deployment",
    proto: "https",
    options: {
      hostname: `icjia-r3.netlify.com`,
      path: "/",
      method: "HEAD"
    },
    category: "site",
    badgeID: "90d739fc-a5ed-459d-8616-d05a6a9e235d",
    displayURL: false,
    github: 'https://github.com/ICJIA/icjia-r3'
  },
  {
    name: "ICJIA R3 site redirect",
    proto: "https",
    options: {
      hostname: `icjia.illinois.gov`,
      path: "/r3",
      method: "HEAD"
    },
    category: "redirect",
    displayURL: true
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
    name: "ICJIA Research Hub deployment",
    proto: "https",
    options: {
      hostname: `researchhub.netlify.com`,
      path: "/",
      method: "HEAD"
    },
    category: "site",
    displayURL: false,
    github: 'https://github.com/ICJIA/researchhub'
  },
  {
    name: "ICJIA Research Hub site redirect",
    proto: "https",
    options: {
      hostname: `icjia.illinois.gov`,
      path: "/researchhub",
      method: "HEAD"
    },
    category: "redirect",
    displayURL: true
  },

  {
    name: "ICJIA Research Hub Docs deployment",
    proto: "https",
    options: {
      hostname: `researchhub-docs.netlify.com`,
      path: "/",
      method: "HEAD"
    },
    category: "site",
    displayURL: false,
    github: 'https://github.com/ICJIA/researchhub'
  },
  {
    name: "ICJIA Research Hub Docs site redirect",
    proto: "https",
    options: {
      hostname: `icjia.illinois.gov`,
      path: "/researchhub/docs",
      method: "HEAD"
    },
    category: "redirect",
    displayURL: true
  },

  {
    name: "ICJIA public deployment",
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
    name: "ICJIA public site redirect",
    proto: "https",
    options: {
      hostname: `icjia.illinois.gov`,
      path: "/",
      method: "HEAD"
    },
    category: "redirect",
    displayURL: true
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
    name: "ICJIA coronavirus information api server",
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
    name: "ICJIA site status api server",
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
    name: "ICJIA site status deployment",
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
  }
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
