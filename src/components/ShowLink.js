import React, { useState, useEffect } from "react";
import axios from "axios";

const ShowLink = ({ url }) => {
  const [metadata, setMetadata] = useState(null);

  const fetchMetadata = async () => {
    try {
      const response = await axios.get("https://music-idea-k3r9.onrender.com/fetch-youtube-metadata", {
        params: { url },
      });
      setMetadata(response.data);
    } catch (error) {
      console.error("Failed to fetch metadata", error);
      setMetadata({ error: "Unable to fetch metadata. Please try again." });
    }
  };

  // コンポーネントのレンダリング時にfetchMetadataを自動発動
  useEffect(() => {
    if (url) {
      fetchMetadata();
    }
  }, [url]); // urlが変化した場合にも再発動

  return (
    <div>
      {metadata ? (
        metadata.error ? (
          <p style={{ color: "red" }}>{metadata.error}</p>
        ) : (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginTop: "10px",
              }}
            >
              <h3>{metadata.title}</h3>
              {metadata.image && (
                <img
                  src={metadata.image}
                  alt="Preview"
                  style={{ width: "100%" }}
                />
              )}
            </div>
          </a>
        )
      ) : (
        <p>Loading metadata...</p>
      )}
    </div>
  );
};

export default ShowLink;
