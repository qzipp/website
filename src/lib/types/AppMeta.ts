type AppMeta = {
  icon?: string,
  title: string,
  window?: {
    width?: number,
    height?: number,
    
    resize?: boolean,
    closed?: boolean,
    scrollable?: boolean,

    z_index?: number,
  }
};
