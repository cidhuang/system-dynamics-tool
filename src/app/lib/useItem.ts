import { useState } from "react";
import {
  Variable,
  Link,
  Stock,
  Flow,
} from "@/components/SystemMapCanvas/lib/types";

export function useItem(): [
  Variable[],
  Link[],
  Stock[],
  Flow[],
  (variables: Variable[]) => void,
  (links: Link[]) => void,
  (stocks: Stock[]) => void,
  (flows: Flow[]) => void,
] {
  const [variables, setVariables] = useState<Variable[]>(new Array<Variable>());
  function handleVariablesChange(variables: Variable[]): void {
    setVariables(variables);
  }

  const [links, setLinks] = useState<Link[]>(new Array<Link>());
  function handleLinksChange(links: Link[]): void {
    setLinks(links);
  }

  const [stocks, setStocks] = useState<Stock[]>(new Array<Stock>());
  function handleStocksChange(stocks: Stock[]): void {
    setStocks(stocks);
  }

  const [flows, setFlows] = useState<Flow[]>(new Array<Flow>());
  function handleFlowsChange(flows: Flow[]): void {
    setFlows(flows);
  }

  return [
    variables,
    links,
    stocks,
    flows,
    handleVariablesChange,
    handleLinksChange,
    handleStocksChange,
    handleFlowsChange,
  ];
}
