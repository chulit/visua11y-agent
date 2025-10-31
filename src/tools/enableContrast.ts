import addStylesheet from '@/utils/addStylesheet';
import { generateCSSFromConfig } from '@/utils/cssGenerator';
import { FILTERS } from '@/enum/Filters';

export default function enableContrast(contrast) {
  const filter = FILTERS[contrast];

  if (!filter) {
    // Remove styles if no contrast is set
    document.getElementById('visua11y-agent-filter-style')?.remove();
    document.documentElement.classList.remove('aws-filter');
    return;
  }

  const css = generateCSSFromConfig({
    ...filter,
    selector: 'html.aws-filter',
  });

  addStylesheet({ css, id: 'visua11y-agent-filter-style' });
  document.documentElement.classList.add('aws-filter');
}
