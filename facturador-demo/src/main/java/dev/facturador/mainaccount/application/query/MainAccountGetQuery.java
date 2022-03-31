package dev.facturador.mainaccount.application.query;

import dev.facturador.mainaccount.domain.MainAccount;
import dev.facturador.mainaccount.domain.MainAccountIdUsername;
import dev.facturador.shared.application.querybus.Query;
import org.springframework.stereotype.Component;

public class MainAccountGetQuery extends Query<MainAccount> {

    private MainAccountIdUsername mainAccountIdUsername;

    public MainAccountGetQuery(MainAccountIdUsername mainAccountIdUsername) {
        this.mainAccountIdUsername = mainAccountIdUsername;
    }

    public MainAccountIdUsername getMainAccountIdUsername(){
        return this.mainAccountIdUsername;
    }

    public static class Builder {
        private MainAccountIdUsername mainAccountIdUsername;

        public static MainAccountGetQuery.Builder getInstance() {
            return new MainAccountGetQuery.Builder();
        }

        public MainAccountGetQuery.Builder mainAccountIdUsername(MainAccountIdUsername mainAccountIdUsername) {
            this.mainAccountIdUsername = mainAccountIdUsername;
            return this;
        }

        public MainAccountGetQuery build() {
            return new MainAccountGetQuery(mainAccountIdUsername);
        }
    }


}
