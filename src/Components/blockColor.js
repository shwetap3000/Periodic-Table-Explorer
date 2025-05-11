const getBlockColor = (block) => {
    switch (block) {
      case "s":
        return "skyblue"; // Yellow for s-block
      case "p":
        return "green"; // Sky blue for p-block
      case "d":
        return "orange"; // Salmon for d-block
      case "f":
        return "purple"; // Orchid for f-block
      default:
        return "white"; // White for undefined blocks
    }
  };

export default getBlockColor;