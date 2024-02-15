import { useRouter } from "next/navigation";
import React from "react";
import { Pagination } from "react-bootstrap";

const PaginationDisplay = ({ metadata }) => {
  const router = useRouter();
  return (
    <>
      <Pagination style={{ float: "right", marginTop: "20px" }}>
        <Pagination.First
          disabled={metadata?.links?.first ? false : true}
          onClick={() => {
            router.push(`/products${metadata?.links?.first}`);
          }}
        />
        <Pagination.Prev
          disabled={metadata?.links?.prev ? false : true}
          onClick={() => {
            router.push(`/products${metadata?.links?.prev}`);
          }}
        />
        <Pagination.Next
          disabled={metadata?.links?.next ? false : true}
          onClick={() => {
            router.push(`/products${metadata?.links?.next}`);
          }}
        />
        <Pagination.Last
          disabled={metadata?.links?.last ? false : true}
          onClick={() => {
            router.push(`/products${metadata?.links?.last}`);
          }}
        />
      </Pagination>
    </>
  );
};

export default PaginationDisplay;
