function isMobileDevice(width: number): boolean {
  const mobileWidth = 768;

  return width <= mobileWidth;
}

export default isMobileDevice;
