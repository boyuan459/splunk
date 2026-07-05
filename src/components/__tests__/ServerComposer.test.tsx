import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ServerComposer } from '../ServerComposer';

describe('ServerComposer', () => {
  it('renders the input controls and no output before submit', () => {
    render(<ServerComposer />);
    expect(screen.getByLabelText(/cpu/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/memory size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/gpu accelerator card/i)).toBeInTheDocument();
    expect(screen.queryByText(/server model options/i)).not.toBeInTheDocument();
  });

  it('auto-formats the memory input with thousands separators while typing', async () => {
    const user = userEvent.setup();
    render(<ServerComposer />);
    const memory = screen.getByLabelText(/memory size/i) as HTMLInputElement;

    await user.type(memory, '2048');

    expect(memory.value).toBe('2,048');
  });

  it('shows matching models after submit (Example 2)', async () => {
    const user = userEvent.setup();
    render(<ServerComposer />);

    await user.selectOptions(screen.getByLabelText(/cpu/i), 'Power');
    await user.clear(screen.getByLabelText(/memory size/i));
    await user.type(screen.getByLabelText(/memory size/i), '262,144');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/server model options/i)).toBeInTheDocument();
    expect(screen.getByText('Tower Server')).toBeInTheDocument();
    expect(screen.getByText('4U Rack Server')).toBeInTheDocument();
    expect(screen.getByText('Mainframe')).toBeInTheDocument();
  });

  it('shows Tower Server or 4U Rack Server for X86 + 524,288 (Example 3)', async () => {
    const user = userEvent.setup();
    render(<ServerComposer />);

    await user.selectOptions(screen.getByLabelText(/cpu/i), 'X86');
    await user.clear(screen.getByLabelText(/memory size/i));
    await user.type(screen.getByLabelText(/memory size/i), '524,288');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText('Tower Server')).toBeInTheDocument();
    expect(screen.getByText('4U Rack Server')).toBeInTheDocument();
  });

  it('shows High Density for ARM + GPU + 524,288 (Example 4)', async () => {
    const user = userEvent.setup();
    render(<ServerComposer />);

    await user.selectOptions(screen.getByLabelText(/cpu/i), 'ARM');
    await user.clear(screen.getByLabelText(/memory size/i));
    await user.type(screen.getByLabelText(/memory size/i), '524,288');
    await user.click(screen.getByLabelText(/gpu accelerator card/i));
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText('High Density Server')).toBeInTheDocument();
    expect(screen.queryByText('Tower Server')).not.toBeInTheDocument();
  });

  it('shows "No Options" when nothing matches (Example 1)', async () => {
    const user = userEvent.setup();
    render(<ServerComposer />);

    await user.selectOptions(screen.getByLabelText(/cpu/i), 'Power');
    await user.clear(screen.getByLabelText(/memory size/i));
    await user.type(screen.getByLabelText(/memory size/i), '1,024');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/no options/i)).toBeInTheDocument();
  });

  it('shows a validation error and no output for a non power of two', async () => {
    const user = userEvent.setup();
    render(<ServerComposer />);

    await user.clear(screen.getByLabelText(/memory size/i));
    await user.type(screen.getByLabelText(/memory size/i), '3,072');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/power of 2/i)).toBeInTheDocument();
    expect(screen.queryByText(/server model options/i)).not.toBeInTheDocument();
  });

  it('hides a previous result as soon as any input is edited', async () => {
    const user = userEvent.setup();
    render(<ServerComposer />);

    await user.selectOptions(screen.getByLabelText(/cpu/i), 'Power');
    await user.clear(screen.getByLabelText(/memory size/i));
    await user.type(screen.getByLabelText(/memory size/i), '262,144');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/server model options/i)).toBeInTheDocument();

    // Changing the CPU invalidates the shown result — it should disappear until
    // the user submits again.
    await user.selectOptions(screen.getByLabelText(/cpu/i), 'X86');
    expect(screen.queryByText(/server model options/i)).not.toBeInTheDocument();
  });

  it('clears a previous result when a new submit fails validation', async () => {
    const user = userEvent.setup();
    render(<ServerComposer />);
    const memory = screen.getByLabelText(/memory size/i);

    await user.clear(memory);
    await user.type(memory, '262,144');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/server model options/i)).toBeInTheDocument();

    await user.clear(memory);
    await user.type(memory, 'oops');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.queryByText(/server model options/i)).not.toBeInTheDocument();
  });

  it('clears the validation error as soon as the user edits the field', async () => {
    const user = userEvent.setup();
    render(<ServerComposer />);
    const memory = screen.getByLabelText(/memory size/i);

    await user.type(memory, '3,072');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/power of 2/i)).toBeInTheDocument();

    // Editing the field should immediately dismiss the stale error.
    await user.type(memory, '0');
    expect(screen.queryByText(/power of 2/i)).not.toBeInTheDocument();
  });

  it('keeps the caret in place when editing mid-number', async () => {
    const user = userEvent.setup();
    render(<ServerComposer />);
    const memory = screen.getByLabelText(/memory size/i) as HTMLInputElement;

    await user.type(memory, '262144'); // shows "262,144"

    // Move the caret to the very front, then type without re-clicking (a click
    // would reset the caret to the end). keyboard() types at the current caret.
    memory.focus();
    memory.setSelectionRange(0, 0);
    await user.keyboard('9');

    expect(memory.value).toBe('9,262,144');
    // Caret should sit just after the inserted "9", not jump to the end.
    expect(memory.selectionStart).toBe(1);
  });
});
