const formatNumber = (number) => {
    if (number === undefined || number === null) {
      return "0";
    }
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  export default formatNumber;