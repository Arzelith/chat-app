import React from 'react';
import EmojiPicker from 'emoji-picker-react';
const EmojiPickerContainerToMemo = ({ setEmoji }) => {
  return (
    <EmojiPicker
      width={'100%'}
      height={'100%'}
      emojiStyle='native'
      lazyLoadEmojis={false}
      emojiVersion={'3.0'}
      searchPlaceHolder='Buscar...'
      skinTonesDisabled
      categories={[
        {category:'suggested', name:'Recientes'},
        {category:'smileys_people', name:'Emoticonos y personas'},
        {category:'animals_nature', name:'Animales y naturaleza'},
        {category:'food_drink', name:'Comidas y bebidas'},
        {category:'travel_places', name:'Viajes y lugares'},
        {category:'objects', name:'objetos'},
      ]}
      previewConfig={{ showPreview: false }}
      onEmojiClick={(e) => {
        setEmoji(e.emoji);
      }}
    />
  );
};

const EmojiPickerContainer = React.memo(EmojiPickerContainerToMemo);
export default EmojiPickerContainer;
