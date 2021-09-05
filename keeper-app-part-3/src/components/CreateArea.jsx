import React from "react";

function CreateArea(props) {

  const [input, setInput] = React.useState({
    title: "",
    content: ""
  });

  const handleChange = (event => {
    
    const {value, name} = event.target;

    setInput((prev) => {
      return ({
        ...prev,
        [name]: value
      })
    });

  });

  return (
    <div>
      <form>
        <input onChange={handleChange} name="title" placeholder="Title" value={input.title}/>
        <textarea onChange={handleChange} name="content" placeholder="Take a note..." rows="3" value={input.content}/>
        <button onClick={(event) => {
          event.preventDefault();
          props.createItem(input.title, input.content);
          setInput({title: "", content: ""});
        }}>Add</button>
      </form>
    </div>
  );
}

export default CreateArea;
