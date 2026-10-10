<script lang="ts">
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
</script>

{#snippet inputwithlabel(
  label: string,
  name: string,
  type: string = "text",
  required: boolean = false,
)}
  <div class="mb-4 flex flex-col">
    <label for={name} class="sr-only">{label}</label>
    <input
      {name}
      id={name}
      {type}
      {required}
      placeholder={label}
      class="rounded border border-orange-300 bg-orange-100 p-4 text-orange-500 placeholder-orange-300"
    />
  </div>
{/snippet}

{#if submitted}
  <div class="p-4">
    {#if formError === "submission"}
      <span class="text-red-700">
        Error: Please try refreshing the page and try submitting again.
      </span>
    {:else}
      <span class="text-green-700">
        Your message has been sent! I will get back to you as soon as possible.
      </span>
    {/if}
  </div>
{:else}
  <form onsubmit={handleSubmit} class="p-8">
    <h2 class="mb-8 text-3xl font-bold text-orange-500 text-shadow-lg">
      Send me a message
    </h2>
    <input type="hidden" name="access_key" value={web3formsKey} />

    {@render inputwithlabel("Name", "name", "text", true)}
    {@render inputwithlabel("Email", "email", "email", true)}
    <label for="message" class="sr-only">Message</label>
    <textarea
      name="message"
      id="message"
      placeholder="Message..."
      required
      class="mb-2 h-50 w-full size-fit rounded border border-orange-300 bg-orange-100 p-4 text-orange-500 placeholder-orange-300"
    ></textarea>

    <div class="mb-2 flex flex-col gap-2">
      {#if formError === "captcha"}
        <span class="grow text-red-700">Please complete the captcha</span>
      {/if}
      <div class="h-captcha" data-captcha="true"></div>
    </div>
    <button type="submit" class="btn text-lg">Send Message</button>
  </form>
{/if}
