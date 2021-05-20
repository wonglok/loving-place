//

import axios from "axios";
import { AuthState, EnvConfig } from "./realtime";
export const URLBASE = "snapshot";

export const create = async ({
  note = "regular backup",
  projectID,
  largeString,
}) => {
  let res = await axios({
    method: "POST",
    baseURL: EnvConfig.rest,
    url: "/" + URLBASE + "?action=create",
    data: {
      projectID,
      largeString,
      note,
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

export const listMine = async ({
  projectID,
  search,
  pageAt = 0,
  perPage = 25,
}) => {
  let res = await axios({
    method: "POST",
    baseURL: EnvConfig.rest,
    url: "/" + URLBASE + "?" + "action=list-mine",
    data: {
      projectID,
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
    url: "/" + URLBASE + "?" + "action=update-mine",
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
    url: "/" + URLBASE + "?" + "action=remove-mine",
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
    url: "/" + URLBASE + "?" + "action=get-one-of-mine",
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

export const ProjectBackup = {
  create,
  listMine,
  updateMine,
  removeMine,
  getOneOfMine,
};

export const ProjectBackupAPI = ProjectBackup;
