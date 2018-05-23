import BugzillaIconLink from './bugzillaIconLink';
import { hgDiffUrl, pushlogUrl } from '../utils/hg';

const CoverageMeta = ({
  changeset, node, overallCoverage, summary,
}) => (
  <div className="coverage-meta">
    <div className="coverage-meta-row">
      <span className="meta">
        {`Current coverage: ${overallCoverage.substring(0, 4)}%`}
      </span>
      <span className="meta meta-right">
        <a href={pushlogUrl(node)} target="_blank">Push Log</a>
      </span>
    </div>
    <div className="coverage-meta-row">
      <span className="meta">{summary}</span>
      <span className="meta meta-right">
        <a href={hgDiffUrl(node)} target="_blank">Hg Diff</a>
      </span>
    </div>
    {changeset &&
      <div className="coverage-meta-row">
        <div>
          <BugzillaIconLink description={changeset.desc} />
          <span style={{ verticalAlign: 'top', whiteSpace: 'pre' }}>{changeset.desc}</span>
        </div>
        <div className="coverage-meta-row">
          <ul className="coverage-legend meta-right">
            <li>Covered<span className="hit coverage-color-legend" /></li>
            <li>Uncovered<span className="miss coverage-color-legend" /></li>
            <li>Unchanged line<span className="nocovchange coverage-color-legend" /></li>
          </ul>
        </div>
      </div>
    }
    <div className="coverage-meta-row">
      <ul className="coverage-legend">
        <li><span className="hit coverage-color-legend" /> Covered</li>
        <li><span className="miss coverage-color-legend" /> Uncovered</li>
        <li><span className="nocovchange coverage-color-legend" /> Unchanged line</li>
      </ul>
    </div>
  </div>
);

export default CoverageMeta;
