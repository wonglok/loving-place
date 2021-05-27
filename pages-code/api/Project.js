//

import axios from "axios";
import { AuthState, EnvAll, EnvConfig } from "./realtime";

export const create = async ({ displayName, largeString = undefined }) => {
  let res = await axios({
    method: "POST",
    baseURL: EnvConfig.rest,
    url: "/project?action=create",
    data: {
      displayName,
      largeString,
    },
    headers: {
      "x-token": AuthState.jwt.value,
      "access-control-allow-origin": window.location.origin,
    },
    withCredentials: true,
  }).then(
    (res) => res.data,
    (e) => {
      return Promise.reject({
        message: e?.response?.data?.msg || "server error",
      });
    }
  );

  return res;
};

export const listMine = async ({ search, pageAt = 0, perPage = 25 }) => {
  let res = await axios({
    method: "POST",
    baseURL: EnvConfig.rest,
    url: "/project?" + "action=list-mine",
    data: {
      search,
      pageAt,
      perPage,
    },
    headers: {
      "x-token": AuthState.jwt.value,
      "access-control-allow-origin": window.location.origin,
    },
    withCredentials: true,
  }).then(
    (res) => res.data,
    (e) => {
      return Promise.reject({
        message: e?.response?.data?.msg || "server error",
      });
    }
  );

  return res;
};

export const updateMine = async ({ object }) => {
  let res = await axios({
    method: "POST",
    baseURL: EnvConfig.rest,
    url: "/project?" + "action=update-mine",
    data: {
      _id: object._id,
      object,
    },
    headers: {
      "x-token": AuthState.jwt.value,
      "access-control-allow-origin": window.location.origin,
    },
    withCredentials: true,
  }).then(
    (res) => res.data,
    (e) => {
      return Promise.reject({
        message: e?.response?.data?.msg || "server error",
      });
    }
  );

  return res;
};

export const removeMine = async ({ object }) => {
  let res = await axios({
    method: "POST",
    baseURL: EnvConfig.rest,
    url: "/project?" + "action=remove-mine",
    data: {
      _id: object._id,
    },
    headers: {
      "x-token": AuthState.jwt.value,
      "access-control-allow-origin": window.location.origin,
    },
    withCredentials: true,
  }).then(
    (res) => res.data,
    (e) => {
      return Promise.reject({
        message: e?.response?.data?.msg || "server error",
      });
    }
  );

  return res;
};

export const getOneOfMine = async ({ _id }) => {
  let res = await axios({
    method: "POST",
    baseURL: EnvConfig.rest,
    url: "/project?" + "action=get-one-of-mine",
    data: {
      _id: _id,
    },
    headers: {
      "x-token": AuthState.jwt.value,
      "access-control-allow-origin": window.location.origin,
    },
    withCredentials: true,
  }).then(
    (res) => res.data,
    (e) => {
      return Promise.reject({
        message: e?.response?.data?.msg || "server error",
      });
    }
  );

  return res;
};

export const getOneOfPublished = async ({ _id }) => {
  let res = await axios({
    method: "POST",
    baseURL: EnvConfig.rest,
    url: "/project?" + "action=get-one-of-published",
    data: {
      _id: _id,
    },
    headers: {
      "access-control-allow-origin": window.location.origin,
    },
    withCredentials: true,
  }).then(
    (res) => res.data,
    (e) => {
      return Promise.reject({
        message: e?.response?.data?.msg || "server error",
      });
    }
  );

  return res;
};

export const getTemplateCode = async ({ _id }) => {
  let res = await axios({
    method: "POST",
    baseURL: EnvAll["production"].rest,
    url: "/project?" + "action=get-one-of-published",
    data: {
      _id: _id,
    },
    headers: {
      "access-control-allow-origin": window.location.origin,
    },
    withCredentials: true,
  }).then(
    (res) => res.data,
    (e) => {
      return Promise.reject({
        message: e?.response?.data?.msg || "server error",
      });
    }
  );

  return res;
};

export const Project = {
  create,
  listMine,
  updateMine,
  removeMine,
  getOneOfMine,
  getOneOfPublished,
  getTemplateCode,
};

export const ProjectAPI = Project;
