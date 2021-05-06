/**
 * A simple type to gather annotations on any method
 */
export type MethodAnnotation = {
  name: string;
  args: string[];
};

/**
 * The route table has HTTP methods for key names
 */
export type RouteTable = Map<string, MethodRoutes>;

type MethodRoutes = {
  // The key in this table is a mimetype, the value is a controller method name.
  accepts: Map<string, string>;

  // If it's a string, it refers to a controller method, if it's null there is no default.
  default: string | null;
};
