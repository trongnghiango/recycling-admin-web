/**
 * Base is the default environment for production.
 * Add everything here and override value in other files if needed.
 * https://blog.usejournal.com/my-awesome-custom-react-environment-variables-setup-8ebb0797d8ac
 *
 * ts-prune-ignore-next
 */
export default function baseEnv() {
  const isDevelopment = process.env.NODE_ENV !== "production";
  const isProduction = process.env.NODE_ENV === "production";
  const appDev = "http://localhost:3000";
  const appPro = "http://localhost:3000";

  return {
    host: "http://localhost:80",
    api: {
      patients: "http://localhost:1337/patients/all",
      clinics: "http://localhost:1337/clinic/all",
      film: "http://localhost:8080/api/v1/patient/:patientId",
      films: "https://swapi.dev/api/films",
    },

    isServer: typeof window === "undefined",
    isClient: typeof window !== "undefined",
    isDevelopment,
    isProduction,
    app: {
      users: `/api/v1/users`,
      user: `/api/users/:userId`,
      upload: `/api/v1/upload`,
      uploads: "/api/uploads",
    },
    token: "",
  };
}

export type Environment = ReturnType<typeof baseEnv>;
