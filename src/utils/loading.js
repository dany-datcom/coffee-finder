export function setLoading(
  loading,
  message = "Searching coffee shops..."
) {
  const loader =document.getElementById("loader");
  const loaderText = document.querySelector(".loader-text");
  const input = document.getElementById("search-input");
  const button = document.getElementById("search-button");
  const sort = document.getElementById("sort-select");

  if (!loader) return;

  loader.classList.toggle(
    "hidden",
    !loading
  );

  if (loaderText) {
    loaderText.textContent = message;
  }

  input?.toggleAttribute(
    "disabled",
    loading
  );

  button?.toggleAttribute(
    "disabled",
    loading
  );

  sort?.toggleAttribute(
    "disabled",
    loading
  );
}