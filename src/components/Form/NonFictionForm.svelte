<script lang="ts">
  import { questions } from "./config";
  import Question from "./Question.svelte";

  const { web3formsKey } = $props();

  let formError: "captcha" | "submission" | null = $state(null);
  let submitted = $state(false);

  function handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const hcaptcha = formData.get("h-captcha-response");

    if (!hcaptcha) {
      formError = "captcha";
      return;
    }

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          formError = null;
        } else {
          formError = "submission";
          throw Error("Form submission failed");
        }
      })
      .catch((e) => {
        formError = "submission";
        throw e;
      })
      .finally(() => {
        submitted = true;
        form.reset();
      });
  }

  let answers = $state(
    Object.fromEntries(questions.map((value) => [value.id, ""])),
  );
</script>

{#snippet inputWithLabel(
  label: string,
  name: string,
  type: string = "text",
  required: boolean = false,
)}
  <div class="mb-4 flex flex-col">
    <label for={name}>{label}</label>
    <input {name} id={name} {type} {required} placeholder={label} />
  </div>
{/snippet}

<form onsubmit={handleSubmit}>
  <input type="hidden" name="access_key" value={web3formsKey} />
  <input
    hidden
    name="Fiction/NonFiction"
    id="fiction-non-fiction"
    type="text"
    value="Fiction"
  />
  <div class="h-captcha" data-captcha="true"></div>
  <div>
    {#each questions as question}
      <Question {question} bind:value={answers[question.id]} />
    {/each}

    <div>
      <h3>Review</h3>
      {#each questions as question}
        <p>{question.label}</p>
        {answers[question.id]}
      {/each}
    </div>
    <button type="submit" class="btn text-lg">Submit</button>
  </div>
</form>
