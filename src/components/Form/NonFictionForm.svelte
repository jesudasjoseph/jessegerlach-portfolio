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

  const onNavigate = (id: string) => {
    document
      .querySelector(`#${id}-container`)
      ?.scrollIntoView({ behavior: "smooth" });
  };
</script>

<form onsubmit={handleSubmit} class="scroll-smooth">
  <input type="hidden" name="access_key" value={web3formsKey} />
  <input
    hidden
    name="Fiction/NonFiction"
    id="fiction-non-fiction"
    type="text"
    value="Fiction"
  />
  <div>
    {#each questions as question}
      <div
        class="h-dvh flex items-center justify-center"
        id="{question.id}-container"
      >
        <Question {question} bind:value={answers[question.id]} />
      </div>
    {/each}
    <div>
      <h3>Review</h3>
      <ol class="list-decimal list-inside marker:text-xl">
        {#each questions as question}
          <li>
            <button
              class="text-xl text-left cursor-pointer"
              type="button"
              onclick={() => {
                onNavigate(question.id);
              }}
            >
              {question.label}
            </button>
            <p class="text-xl">
              {answers[question.id] ? answers[question.id] : "No Answer"}
            </p>
          </li>
        {/each}
      </ol>
    </div>
    <div class="h-captcha" data-captcha="true"></div>
    <button type="submit" class="btn text-lg">Submit</button>
  </div>
</form>
