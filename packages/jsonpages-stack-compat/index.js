import stack from "@olonjs/stack";

export default stack;
export const peerDependencies = stack.peerDependencies ?? {};
export const dependencies = stack.dependencies ?? {};
export const devDependencies = stack.devDependencies ?? {};
