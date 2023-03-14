import {
  BsFillArrowLeftSquareFill,
  BsFillArrowRightSquareFill,
} from "react-icons/bs";

type Props = {
  isNextPage: boolean;
  pageNumber: number;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  maxPageNumber: number;
};

function PageChangeButton({
  isNextPage = true,
  pageNumber,
  setPageNumber,
  maxPageNumber,
}: Props) {
  const isPreviousPage = !isNextPage;
  const baseClassName =
    "w-full flex justify-center items-center space-x-4 py-3 mb-2 bg-blue-500 text-white font-bold rounded transition transform ease-in-out cursor-pointer hover:bg-blue-700";
  const previousPageClassName =
    pageNumber < 1 && "!bg-blue-300 hover:!bg-blue-200 cursor-not-allowed";
  const nextPageClassName =
    pageNumber > maxPageNumber &&
    "!bg-blue-300 hover:!bg-blue-200 cursor-not-allowed";

  const goToPreviousPage = () => {
    if (pageNumber > 0) {
      setPageNumber(pageNumber - 1);
    }
  };

  const goToNextPage = () => {
    setPageNumber(pageNumber + 1);
    // if (pageNumber > 5 && maxPageNumber) {
    // }
  };

  return (
    <>
      <div
        onClick={() => {
          isNextPage ? goToNextPage() : goToPreviousPage();
        }}
        className={`${baseClassName} ${
          isPreviousPage && previousPageClassName
        } ${isNextPage && nextPageClassName}`}
      >
        {isNextPage ? (
          <BsFillArrowRightSquareFill />
        ) : (
          <BsFillArrowLeftSquareFill />
        )}
        <h3>{isNextPage ? "More" : "Back"}</h3>
      </div>
    </>
  );
}
export default PageChangeButton;
