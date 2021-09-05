import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function App() {

  const [listItems, setListItems] = React.useState([]);

  const addItem = (newTitle, newContent) => {
    setListItems(prev => {
      return [
        ...prev,
        {title: newTitle, content: newContent}
      ]
    });
  }

  const deleteItem = (id => {
    setListItems(listItems.filter((item, index) => index !== id));
  })

  return (
    <div>
      <Header />
      <CreateArea createItem={addItem}/>
      {listItems.map((item, index) => 
        <Note key={index} id={index} remove={deleteItem} title={item.title} content={item.content} />
      )}
      <Footer />
    </div>
  );
}

export default App;
