function Loader({ text = "Loading..." }) {
  return (
    <div className="center-box">
      <div className="spinner"></div>
      <p>{text}</p>
    </div>
  );
}

export default Loader;
