import styles from './styles/Slider.module.css';
import { useRef, useEffect, useState } from 'react';
import GosNumber from './GosNumber';
import { LazyLoadImage } from 'react-lazy-load-image-component';

function Slider({ images, imagesDivRef, setActiveImage, canAdd, activeImage, setImages, maxImagesCount, photosError, setPhotosError, category }) {

  const imagesCountDivRef = useRef();
  const imagesScrollBarDivRef = useRef();

  const [ sliderPosition, setSliderPosition ] = useState(0);

  const handleScroll = () => {
    if (imagesDivRef.current) {
      const scrollLeft = imagesDivRef.current.scrollLeft;
      const offsetWidth = window.innerWidth;
      const scrollPosition = Math.max(0, (scrollLeft / offsetWidth).toFixed(0)) + 1;
      if (imagesCountDivRef.current) {
        imagesCountDivRef.current.innerHTML = `${scrollPosition}/${images.length}`
      };
      setSliderPosition(scrollLeft / imagesDivRef.current.scrollWidth * 100);
      if (imagesScrollBarDivRef.current) {
        imagesScrollBarDivRef.current.style.width = `${100/images.length}%`;
        imagesScrollBarDivRef.current.style.margin = `0 0 0 ${scrollLeft / imagesDivRef.current.scrollWidth * 100}%`;
      };
      for (var i in images) {
        if (Number(i) + 1 == scrollPosition) {
          setActiveImage(i);
        };
      };
    };
  };

  useEffect(() => {
    if (imagesDivRef.current && images.length > 0) {
      imagesDivRef.current.addEventListener('scroll', handleScroll);
    };
    if (imagesCountDivRef.current) {
      const text = imagesCountDivRef.current.innerHTML;
      const slashIndex = text.indexOf('/');

      if (slashIndex !== -1) {
        const firstPart = text.slice(0, slashIndex + 1);
        const secondPart = `${images.length}`;
        imagesCountDivRef.current.innerHTML = firstPart + secondPart;
      }
    };
    if (imagesScrollBarDivRef.current) {
      imagesScrollBarDivRef.current.style.width = `${100/images.length}%`;
      imagesScrollBarDivRef.current.style.margin = `0 0 0 ${sliderPosition}%`;
    };
    return () => {
      if (imagesDivRef.current && images.length > 0) {
        imagesDivRef.current.removeEventListener('scroll', handleScroll);
      };
    };
  }, [images]);

  const handleImageUpload = (e) => {
    var files;
    var photos_length;

    files = Array.from(e.target.files).slice(0, maxImagesCount - images.length);
    photos_length = images.length;

    let index = 0;

    files.forEach(file => {
      const reader = new FileReader();

      reader.onload = (e) => {
        setImages((prevImages) => [...prevImages, { file: e.target.result }]);
        index += 1;
      };

      reader.readAsDataURL(file);
    });

    setPhotosError(null);
  };

  const handleRemoveImage = () => {
    setImages(images.filter((_, index) => index != activeImage));
    imagesDivRef.current.scrollLeft = window.innerWidth * activeImage;
  }

  return (
    <div className={styles.imagesWrapper} style={!canAdd ? {borderTopLeftRadius: 25, borderTopRightRadius: 25} : null}>
      { !canAdd ?
          <div className={styles.images} ref={imagesDivRef}>
            {images.map((image, index) => (
              <div className={styles.image} key={index}>
                <LazyLoadImage src={image.file} placeholderSrc={image.file_lazy} alt="" />
              </div>
            ))}
          </div>
        :
          ( images.length > 0 ?
              <div className={styles.images} ref={imagesDivRef}>
                {images.map((image, index) => (
                  <div className={styles.image} key={index}>
                    <img src={image.file} alt="" />
                  </div>
                ))}
              </div>
            :
              <div className={styles.addImage} ref={imagesDivRef} onClick={() => document.getElementById('photo-input').click()}>
                <div><img src={require("./images/plus2.svg").default} alt="plus"/></div>
                <div>Добавить фотографии</div>
                <div className={styles.smallText}>Максимальное количество фотографий {maxImagesCount} шт.</div>
                {photosError && <div className={styles.error}>{photosError}</div>}
                <input
                  id="photo-input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>
          )
      }
      {images.length > 1 &&
      <div className={styles.count}>
        <div ref={imagesCountDivRef}>1/{images.length}</div>
      </div>}
      {images.length > 1 &&
      <div className={styles.scrollbar}>
        <div ref={imagesScrollBarDivRef}></div>
      </div>}
      {(canAdd && images.length > 0) &&
        <div className={styles.removeImage} onClick={handleRemoveImage}>
          <img src={require("./images/remove.svg").default} alt="remove"/>
        </div>}
    </div>
  );
}

export default Slider;
