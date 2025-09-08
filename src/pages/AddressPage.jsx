const AddressPage = () => {
  const handleSave = () => {
    console.log("Address saved");
  };
  return (
    <>
      Add your addresses here;
      <button onClick={() => handleSave()}>Save</button>
    </>
  );
};

export default AddressPage;
