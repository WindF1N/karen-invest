import styles from './styles/MiniSlider.module.css';
import { useRef, useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

function MiniSlider({ images, imagesDivRef, activeImage, setActiveImage, canAdd, setImages, maxImagesCount, canDelete, style }) {

  const activeImageRef = useRef();
  const sliderRef = useRef();

  const handleClick = (i) => {
    if (imagesDivRef) {
      imagesDivRef.current.scrollLeft = window.innerWidth * i
    };
  };

  const scrollToLeft = () => {
    if (sliderRef.current) {
      const startTime = performance.now();
      const duration = 300; // Длительность анимации в миллисекундах
      const startPosition = sliderRef.current.scrollLeft;
      const endPosition = 0;

      const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentPosition = startPosition + (endPosition - startPosition) * progress;

        if (sliderRef.current) {
          sliderRef.current.scrollLeft = currentPosition;
        }

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    }
  }

  useEffect(() => {
    if (activeImageRef.current) {
      activeImageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };
    if (activeImage < 3 && sliderRef.current) {
      scrollToLeft();
    }
  }, [activeImage])

  const handlePhotoUpload = (e) => {
    var files;
    var photos_length;

    files = Array.from(e.target.files).reverse().slice(0, maxImagesCount - images.length);
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
  };

  const handleRemovePhoto = (i) => {
    setImages(images.filter((_, index) => index !== Number(i)));
    setActiveImage(null);
  };

  useEffect(() => {
    if (canDelete) {
      const timer = setTimeout(() => {
        setActiveImage(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [activeImage])

  return (
    <div className={styles.images}>
      <div className={styles.hack}>
        <div ref={sliderRef} style={style}>
          {(canAdd && images.length < 10) &&
            <div className={styles.addImage} onClick={() => document.getElementById('photo-input2').click()}>
              <img src={require("./images/plus2.svg").default} alt="car"/>
              <input
                id="photo-input2"
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
            </div>}
          {images.map((image, index) => (
            !canDelete ?
              (activeImage ?
                <div key={index} className={activeImage == index ? styles.imageActive : styles.image} ref={activeImage == index ? activeImageRef : null} onClick={() => handleClick(index)}>
                  <LazyLoadImage src={image.file} placeholderSrc={image.file_lazy} alt="" />
                </div>
              :
                <div key={index} className={index == 0 ? styles.imageActive : styles.image} onClick={() => handleClick(index)}>
                  <LazyLoadImage src={image.file} placeholderSrc={image.file_lazy} alt="" />
                </div>)
            :
              <div key={index} className={styles.image} onClick={() => handleClick(index)}>
                <LazyLoadImage src={image.file} placeholderSrc={image.file_lazy} alt="" />
                <div className={styles.remove} style={activeImage === index ? {opacity: 1} : {opacity: 0}} onClick={activeImage === index ? () => handleRemovePhoto(index, 2) : () => setActiveImage(index)}>
                  <img src={require("./images/remove.svg").default} alt="remove"/>
                </div>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MiniSlider;
