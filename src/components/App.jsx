import React, { useState, useEffect } from 'react';

import { Searchbar } from './Searchbar';
import { ImageGallery } from './ImageGallery';
import { Modal } from './Modal';
import { LoadMoreButton } from './Button';
import { Loader, LoaderMore } from './Loader';
import { fetchImages } from '../services/api';

export const App = () => {
  const [search, setSearch] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [totalImages, setTotalImages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (search === '' && gallery.length === 0) {
      return;
    }

    setLoading(true);

    fetchImages(search, page)
      .then(response => {
        const data = response.data;
        if (data.hits.length === 0) {
          throw new Error(`No photos found for the search query "${search}"`);
        }
        setGallery(prevGallery => [...prevGallery, ...data.hits]);
        setTotalImages(data.totalHits);
      })
      .catch(error => setError(error.message))
      .finally(() => setLoading(false));
  }, [search, page]);

  const handleFormSubmit = newSearch => {
    setSearch(newSearch);
    setGallery([]);
    setPage(1);
    setTotalImages(0);
  };

  const loadMoreImages = () => {
    setPage(prevPage => prevPage + 1);
  };

  const openModal = image => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <Searchbar onSubmit={handleFormSubmit} />
      {loading && <Loader />}
      {!search && <div>Enter the name of the photo</div>}
      {error && <p>{error}</p>}
      {gallery.length > 0 && (
        <ImageGallery openModal={openModal} gallery={gallery} />
      )}
      {loading && <LoaderMore />}
      {selectedImage && <Modal image={selectedImage} closeModal={closeModal} />}
      {!loading && gallery.length !== totalImages && (
        <LoadMoreButton onClick={loadMoreImages} />
      )}
    </>
  );
};

export default App;
