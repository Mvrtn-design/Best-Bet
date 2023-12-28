function grupos(props) {
  const mensSI = <h2>Si hay algo</h2>;
  const mensNO = <h2> NOOOO HAY NADA</h2>;
  return props.hayAlgo ? mensSI : mensNO;
}
export default grupos;
