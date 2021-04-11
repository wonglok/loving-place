// logic file
export const name = "root";
export const inputs = [{ name: "system" }, { name: "position" }];
export const outputs = [{ name: "system" }, { name: "position" }];
export const logic = async function (core) {
  console.log(core);
};
