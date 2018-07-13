import BugzillaIconLink from './bugzillaIconLink';
import { hgDiffUrl, pushlogUrl } from '../utils/hg';

import dummyIcon from '../static/dummyIcon16x16.png';
import eIcon from '../static/noun_205162_cc.png';

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
          {changeset.authorEmail ?
            <a href={`mailto: ${changeset.authorEmail}`}>
              <img className="eIcon" src={eIcon} alt="email icon" />
            </a> : <img className="icon-substitute" src={dummyIcon} alt="placeholder icon" />
          }
          {changeset.authorName &&
            <span className="changeset-eIcon-align">{changeset.authorName}</span>
          }
        </div>
      </div>
    }
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
  </div>
);

export default CoverageMeta;
