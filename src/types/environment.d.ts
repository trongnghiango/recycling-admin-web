// https://blog.usejournal.com/my-awesome-custom-react-environment-variables-setup-8ebb0797d8ac
declare module "environment" {
  import baseEnv from "environments/base";
  const value: ReturnType<typeof baseEnv>;

  export default value;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Object3DNode<
        OrbitControls,
        typeof OrbitControls
      >;
    }
  }
  declare module "react" {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      // extends React's HTMLAttributes
      directory?: string; // remember to make these attributes optional....
      webkitdirectory?: string;
    }
  }
}
