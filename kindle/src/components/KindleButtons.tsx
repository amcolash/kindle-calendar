import { KINDLE } from '../util/util';

interface KindleButtonsProps {}

export function KindleButtons(props: KindleButtonsProps) {
  if (!KINDLE) return null;

  return <div></div>;
}
